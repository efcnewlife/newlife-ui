type FloatingSurfaceId = symbol;

type FloatingSurfaceEntry = {
  id: FloatingSurfaceId;
  dismiss: () => void;
};

class FloatingSurfaceStackManager {
  private stack: FloatingSurfaceEntry[] = [];

  register(dismiss: () => void): FloatingSurfaceId {
    const id = Symbol("floating-surface");
    this.stack.push({ id, dismiss });
    return id;
  }

  unregister(id: FloatingSurfaceId): void {
    const index = this.stack.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      this.stack.splice(index, 1);
    }
  }

  hasOpen(): boolean {
    return this.stack.length > 0;
  }

  isTop(id: FloatingSurfaceId): boolean {
    const top = this.stack[this.stack.length - 1];
    return top?.id === id;
  }

  dismissTop(): boolean {
    const top = this.stack[this.stack.length - 1];
    if (!top) {
      return false;
    }
    top.dismiss();
    return true;
  }
}

export const floatingSurfaceStackManager = new FloatingSurfaceStackManager();
