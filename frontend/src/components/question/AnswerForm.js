import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createAnswer, fetchAnswerList, updateAnswer } from '../../store/answerSlice';
import { getUserEmail } from '../../store/authSlice';

import CodeReview from './CodeReview';
import YesNoModal from '../layout/YesNoModal';
import classes from './QuestionList.module.css';
import Modal from '../layout/Modal';

const AnswerForm = ({ 
  type, prevAnswer, prevReview, code, language, answerId, questionId,
}) => {
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const email = useSelector(getUserEmail);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [review, setReview] = useState('');
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [isBlank, setIsBlank] = useState(false);
  // const oldCodes = code.match(/```[a-z]*\n[\s\S]*?\n```/g) || [];

  const submitHanlder = (event) => {
    event.preventDefault();
    if (!answer.trim()) {
      setIsBlank(true);
      return;
    }
    setAnswerModalOpen(true);
  };

  const sendAnswerHandler = () => {
    setAnswerModalOpen(false);
    
    if (type === 'create') {
      dispatch(createAnswer({
        questionId, 
        roomId, 
        email,
        content: answer,
        language,
        code: !code ? null : review,
      }))
        .unwrap()
        .then(() => {
          dispatch(fetchAnswerList({ questionId }));
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setAnswer('');
          setReview('');
          setReviewOpen(false);
        });
    }

    if (type === 'edit') {
      if (answerId === -1) return;

      dispatch(updateAnswer({
        answerId, 
        email,
        content: answer,
        language,
        code: review,
      }))
        .unwrap()
        .then(() => {
          dispatch(fetchAnswerList({ questionId }));
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setAnswer('');
          setReview('');
          setReviewOpen(false);
        });
    }
  };

  // console.log(prevAnswer, prevReview);

  useEffect(() => {
    setAnswer(prevAnswer);
    setReview(prevReview);
  }, []);

  return (
    <>
      <Modal open={isBlank} onClose={() => setIsBlank(false)}>
        <p>????????? ??????????????????!</p>
      </Modal>
      <YesNoModal 
        yes={type === 'create' ? '????????????' : '????????????'} 
        no="????????????" 
        open={answerModalOpen} 
        onClose={() => setAnswerModalOpen(false)}
        onNoClick={() => setAnswerModalOpen(false)}
        onYesClick={sendAnswerHandler}
      >
        <p>{type === 'create' ? '????????? ???????????????????' : '????????? ?????????????????????????'}</p>
      </YesNoModal>
      <form
        onSubmit={submitHanlder} 
        className={`${classes.question__form} ${classes.question__answerForm}`}
      >
        <textarea
          id="answer-input"
          type="text"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          rows="5"
        />
        {code && (
          <button 
            type="button" 
            className="question__btn" 
            onClick={() => setReviewOpen((prev) => !prev)}
          >
            {!reviewOpen ? '+ ?????? ??????' : '- ?????? ?????? ??????'}
          </button>
        )}
        {reviewOpen && (
          <CodeReview 
            type={type}
            language={language}
            oldCode={code}
            prevReview={prevReview || ''}
            setReview={setReview}
          />
        )}
        <button type="submit" className={classes.question__answerbtn}>
          {type === 'create' ? '?????? ??????' : '????????????'}
        </button>
      </form>
    </>
  );
};

AnswerForm.propTypes = {
  type: PropTypes.string.isRequired,
  prevAnswer: PropTypes.string.isRequired,
  prevReview: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  answerId: PropTypes.number.isRequired,
  questionId: PropTypes.number.isRequired,
};

export default AnswerForm;
