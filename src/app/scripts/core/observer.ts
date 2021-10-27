export class Observer {
  protected listeners: any[]

  constructor() {
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  unsubscribe(callback) {
    this.listeners = this.listeners.filter(_item => _item !== callback);
  }
}

// window.Observer = Observer;
