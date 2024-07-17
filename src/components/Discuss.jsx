import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { addComment, getComments, updateComment } from './firestorefunctions';

const Discuss = () => {
  const [comments, setComments] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [mainCommentContent, setMainCommentContent] = useState('');
  const [mainCommentTitle, setMainCommentTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getComments().then(comments => {
      setComments(comments);
      setLoading(false);
    });
  }, []);

  const handleContentChange = (value) => {
    setNewContent(value);
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleMainCommentChange = (value) => {
    setMainCommentContent(value);
  };

  const handleMainTitleChange = (e) => {
    setMainCommentTitle(e.target.value);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newContent && !mainCommentContent) return;

    setLoading(true);

    const commentData = {
      title: replyTo === null ? mainCommentTitle : newTitle,
      content: replyTo === null ? mainCommentContent : newContent,
      image: newImage ? URL.createObjectURL(newImage) : null,
      replies: [],
    };

    if (replyTo === null) {
      const addedComment = await addComment(commentData);
      setComments([...comments, addedComment]);
    } else {
      const updatedComments = comments.map((comment, index) => {
        if (index === replyTo) {
          const updatedReplies = [...comment.replies, commentData];
          updateComment(comment.id, { replies: updatedReplies });
          return {
            ...comment,
            replies: updatedReplies,
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setReplyTo(null);
      setShowReplyForm(false);
    }

    setNewContent('');
    setNewImage(null);
    setMainCommentContent('');
    setMainCommentTitle('');
    setLoading(false);
  };

  const handleReply = (index) => {
    setReplyTo(index);
    setShowReplyForm(true);
  };

  const handleHideReply = () => {
    setReplyTo(null);
    setShowReplyForm(false);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="mt-5">
          <h2>Discuss</h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={mainCommentTitle}
                onChange={handleMainTitleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Content</label>
              <ReactQuill
                value={mainCommentContent}
                onChange={handleMainCommentChange}
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    ['link', 'image', 'code-block'],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['clean']
                  ]
                }}
                formats={[
                  'header', 'font', 'size',
                  'bold', 'italic', 'underline', 'strike', 'blockquote',
                  'list', 'bullet', 'indent',
                  'link', 'image', 'code-block',
                  'script', 'sub', 'super',
                  'direction', 'color', 'background',
                  'align', 'clean'
                ]}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Upload Image</label>
              <input
                type="file"
                id="image"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Post</button>
          </form>
          <div>
            <h2>Comments</h2>
            {loading ? (
              <Spinner animation="border" />
            ) : (
              comments.length === 0 ? (
                <p>No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">{comment.title}</h5>
                      <div className="card-text" dangerouslySetInnerHTML={{ __html: comment.content }} />
                      {comment.image && (
                        <img src={comment.image} alt="Comment" className="img-fluid rounded" />
                      )}
                      <button className="btn btn-link" onClick={() => handleReply(index)}>
                        {showReplyForm && replyTo === index ? 'Hide Answer' : 'Answer'}
                      </button>
                      {comment.replies && comment.replies.map((reply, replyIndex) => (
                        <div key={replyIndex} className="card mt-3 ms-3">
                          <div className="card-body">
                            <h5 className="card-title">{reply.title}</h5>
                            <div className="card-text" dangerouslySetInnerHTML={{ __html: reply.content }} />
                            {reply.image && (
                              <img src={reply.image} alt="Reply" className="img-fluid rounded" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      <Modal show={showReplyForm} onHide={handleHideReply}>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="reply-content" className="form-label">Content</label>
              <ReactQuill
                value={newContent}
                onChange={handleContentChange}
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    ['link', 'image', 'code-block'],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['clean']
                  ]
                }}
                formats={[
                  'header', 'font', 'size',
                  'bold', 'italic', 'underline', 'strike', 'blockquote',
                  'list', 'bullet', 'indent',
                  'link', 'image', 'code-block',
                  'script', 'sub', 'super',
                  'direction', 'color', 'background',
                  'align', 'clean'
                ]}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="reply-image" className="form-label">Upload Image</label>
              <input
                type="file"
                id="reply-image"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>
            <Button variant="primary" type="submit">Post Reply</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Discuss;
