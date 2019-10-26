import http from '../http'

const prefix = '/items'

const api = {
  async list(args, config) {
    return (await http.get(`${prefix}`, {
      ...config,
      params: args
    })).data
  },

  async info(args, config) {
    return (await http.get(`${prefix}/${args.id}`, config)).data
  },

  async create(args, config) {
    return (await http.post(`${prefix}`, args, config)).data
  },

  async update(args, config) {
    return (await http.post(`${prefix}/${args.id}`, args, config)).data
  },

  async delete(args, config) {
    return (await http.delete(`${prefix}/${args.id}`, config)).data
  }
}

export default api
