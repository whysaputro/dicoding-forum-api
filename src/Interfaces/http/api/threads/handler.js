const AddNewThreadUseCase = require('../../../../Applications/use_case/AddNewThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postAddNewThreadHandler = this.postAddNewThreadHandler.bind(this);
  }

  async postAddNewThreadHandler(request, h) {
    const addNewThreadUseCase = this._container.getInstance(AddNewThreadUseCase.name);
    const addedThread = await addNewThreadUseCase
      .execute(request.payload, request.auth.credentials);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
