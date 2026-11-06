// 版本管理器
import { CanvasSize, CanvasVersion } from './types';

export class VersionManager {
  private versions: CanvasVersion[] = [];
  private activeId = '';
  private storageKey = 'xhs_cover_versions';

  constructor() {
    this.load();
    if (this.versions.length === 0) {
      this.create('画布 1');
    }
    if (!this.versions.some((version) => version.id === this.activeId)) {
      this.activeId = this.versions[0].id;
      this.save();
    }
  }

  // 创建新版本
  create(name?: string, canvasSize?: CanvasSize) {
    if (this.versions.length >= 5) {
      throw new Error('最多支持 5 个画布');
    }
    const version: CanvasVersion = {
      id: Date.now().toString(),
      name: name || `画布 ${this.versions.length + 1}`,
      data: '',
      canvasSize,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return this.commitChange(() => {
      this.versions.push(version);
      return version;
    });
  }

  // 复制版本
  duplicate(sourceId: string, data: string, canvasSize?: CanvasSize) {
    const source = this.versions.find((v) => v.id === sourceId);
    if (!source) {
      throw new Error('源版本不存在');
    }
    return this.commitChange(() => {
      if (this.versions.length >= 5) throw new Error('最多支持 5 个画布');
      const timestamp = Date.now();
      const newVersion: CanvasVersion = {
        id: timestamp.toString(),
        name: `${source.name} - 副本`,
        data,
        canvasSize: canvasSize || source.canvasSize,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      this.versions.push(newVersion);
      return newVersion;
    });
  }

  // 更新版本
  update(id: string, data: string, thumbnail?: string, canvasSize?: CanvasSize) {
    const version = this.versions.find((v) => v.id === id);
    if (version) {
      this.commitChange(() => {
        version.data = data;
        version.updatedAt = Date.now();
        if (canvasSize) version.canvasSize = canvasSize;
        if (thumbnail) version.thumbnail = thumbnail;
      });
    }
  }

  // 重命名版本
  rename(id: string, newName: string) {
    const version = this.versions.find((v) => v.id === id);
    if (version) {
      this.commitChange(() => {
        version.name = newName;
        version.updatedAt = Date.now();
      });
    }
  }

  // 删除画布
  delete(id: string) {
    if (this.versions.length === 1) {
      throw new Error('至少需要保留 1 个画布');
    }
    this.commitChange(() => {
      this.versions = this.versions.filter((v) => v.id !== id);
      if (this.activeId === id) this.activeId = this.versions[0].id;
    });
  }

  // 获取所有版本
  getAll() {
    return this.versions;
  }

  // 获取当前激活版本
  getActive() {
    return this.versions.find((v) => v.id === this.activeId);
  }

  // 根据 ID 获取版本
  getById(id: string) {
    return this.versions.find((v) => v.id === id);
  }

  // 设置激活版本
  setActive(id: string) {
    if (!this.versions.some((version) => version.id === id)) return;
    this.commitChange(() => { this.activeId = id; });
  }

  // Keep in-memory state consistent with the last durable save when storage is full.
  private commitChange<T>(change: () => T): T {
    const previousVersions = this.versions.map((version) => ({ ...version }));
    const previousActiveId = this.activeId;
    try {
      const result = change();
      this.save();
      return result;
    } catch (error) {
      this.versions = previousVersions;
      this.activeId = previousActiveId;
      throw error;
    }
  }

  // 保存到 localStorage
  private save() {
    if (typeof window !== 'undefined') {
      // Preserve every saved project when storage is full; callers must surface the failure.
      localStorage.setItem(this.storageKey, JSON.stringify({
        versions: this.versions,
        activeId: this.activeId,
      }));
    }
  }

  // 从 localStorage 加载
  private load() {
    if (typeof window !== 'undefined') {
      const json = localStorage.getItem(this.storageKey);
      if (json) {
        try {
          const data = JSON.parse(json);
          // Stored data can be stale or manually modified. Never trust its shape.
          if (!data || !Array.isArray(data.versions)) {
            throw new Error('Invalid saved canvas collection');
          }
          this.versions = data.versions.filter((version: unknown): version is CanvasVersion => {
            if (!version || typeof version !== 'object') return false;
            const candidate = version as Partial<CanvasVersion>;
            return typeof candidate.id === 'string' &&
              candidate.id.length > 0 &&
              typeof candidate.name === 'string' &&
              typeof candidate.data === 'string' &&
              typeof candidate.createdAt === 'number' &&
              typeof candidate.updatedAt === 'number';
          }).slice(0, 5);
          this.activeId = typeof data.activeId === 'string' ? data.activeId : '';
        } catch (error) {
          console.error('Failed to load versions:', error);
        }
      }
    }
  }
}
