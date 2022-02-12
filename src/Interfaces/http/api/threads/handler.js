const AddNewThreadUseCase = require('../../../../Applications/use_case/AddNewThreadUseCase');
const AddNewCommentUseCase = require('../../../../Applications/use_case/AddNewCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postAddNewThreadHandler = this.postAddNewThreadHandler.bind(this);
    this.postAddNewCommentHandler = this.postAddNewCommentHandler.bind(this);
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

  async postAddNewCommentHandler(request, h) {
    const { threadId } = request.params;
    const addNewCommentUseCase = this._container.getInstance(AddNewCommentUseCase.name);
    const addedComment = await addNewCommentUseCase
      .execute(request.payload, threadId, request.auth.credentials);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
