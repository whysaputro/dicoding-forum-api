const AddNewThreadUseCase = require('../../../../Applications/use_case/AddNewThreadUseCase');
const AddNewCommentUseCase = require('../../../../Applications/use_case/AddNewCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const AddNewReplyUseCase = require('../../../../Applications/use_case/AddNewReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const UpdateLikeCommentUseCase = require('../../../../Applications/use_case/UpdateLikeCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postAddNewThreadHandler = this.postAddNewThreadHandler.bind(this);
    this.postAddNewCommentHandler = this.postAddNewCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async postAddNewThreadHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const addNewThreadUseCase = this._container.getInstance(AddNewThreadUseCase.name);
    const addedThread = await addNewThreadUseCase.execute(request.payload, userId);

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
    const { id: userId } = request.auth.credentials;
    const addNewCommentUseCase = this._container.getInstance(AddNewCommentUseCase.name);
    const addedComment = await addNewCommentUseCase
      .execute(request.payload, request.params, userId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const { id: userId } = request.auth.credentials;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(request.params, userId);

    return {
      status: 'success',
    };
  }

  async getThreadHandler(request) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await getThreadUseCase.execute(request.params);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }

  async postCommentReplyHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const addNewReplyUseCase = this._container.getInstance(AddNewReplyUseCase.name);
    const addedReply = await addNewReplyUseCase
      .execute(request.payload, request.params, userId);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const { id: userId } = request.auth.credentials;
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    await deleteReplyUseCase.execute(request.params, userId);

    return {
      status: 'success',
    };
  }

  async putLikeCommentHandler(request) {
    const { id: userId } = request.auth.credentials;
    const updateLikeCommentUseCase = this._container.getInstance(UpdateLikeCommentUseCase.name);
    await updateLikeCommentUseCase.execute(request.params, userId);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
