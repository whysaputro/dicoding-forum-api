class NewThread {
  constructor(payload) {
    this._validatePayload(payload);

    const {title, body} = payload;

    this.title = title;
    this.body = body;
  }

  _validatePayload({title, body}) {
    if (!title || !body) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if(title.length > 100) {
      throw new Error('NEW_THREAD.TITLE_LIMIT_CHAR');
    }
  }

}

module.exports = NewThread;