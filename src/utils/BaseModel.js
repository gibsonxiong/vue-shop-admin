export default class BaseModel {
  doSet(data) { }

  set(data) {
    data = { ...data }

    this.doSet(data)

    Object.assign(this, data)
  }

  doGet(data) { }

  get() {
    const data = { ...this }

    this.doGet(data)

    return data
  }
}
