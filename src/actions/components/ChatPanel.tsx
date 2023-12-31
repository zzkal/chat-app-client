import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { selectUser } from '../redux/user/userSelector';
// import { VALIDATOR_REQUIRE } from '../Util/validators';
import { useDispatch, useSelector } from 'react-redux';
import { selectChat } from '../redux/chat/selectChat';
import { addMsg } from '../redux/chat/chatSlice';
import { AppDispatch } from '../redux/store';
// import { useForm } from '../hooks/form-hook';
import {
  faEllipsisVertical,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons';
// import Button from './FormElements/Button';
import PopUpElement from './PopUpElement';
import { socket } from '../Util/SocketIO';
import React, { useEffect, useRef } from 'react';
// import Input from './FormElements/input';
import MsgBubble from './MsgBubble';

export interface IMsg {
  mid: string;
  cid: string;
  content: string;
  type: string;
  creationDate: Date;
  senderId: string;
}

type Inputs = {
  message: string;
};

const ChatPanel: React.FC = () => {
  const { register, handleSubmit, setValue, control } = useForm<Inputs>({
    defaultValues: { message: '' },
  });
  const { dirtyFields } = useFormState({ control });

  const { chat, cid, chatImage, alias } = useSelector(selectChat);
  const { user } = useSelector(selectUser);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (cid) {
      socket.emit('CLIENT:JOIN_ROOM', { cid });
    }
  }, [cid]);

  useEffect(() => {
    const receivedMsg = (message: IMsg) => {
      dispatch(addMsg(message));
    };

    socket.on('SERVER:SEND_MSG', receivedMsg);
    socket.on('SERVER:SAVED_MSG', receivedMsg);

    return () => {
      socket.off('SERVER:SEND_MSG', receivedMsg);
      socket.off('SERVER:SAVED_MSG', receivedMsg);
    };
  }, [dispatch]);

  useEffect(() => {
    chatAreaRef.current?.scrollTo(0, chatAreaRef.current?.scrollHeight);
  }, [chat]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    socket.emit('CLIENT:SEND_MSG', {
      cid,
      content: data.message,
      type: 'TEXT',
      senderId: user.uid,
    });
    setValue('message', '');
  };

  return (
    <div className={`flex w-full h-full  flex-col bg-white`}>
      {/* contact bar */}
      <div className='w-full h-32 flex justify-between bg-grayLight p-5'>
        <div className='flex'>
          {chatImage ? (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${chatImage}`}
              alt=''
              className='w-20 h-20 mr-6 circle cursor-pointer transition hover:backdrop-blur-lg hover:opacity-95'
            />
          ) : (
            <div className='w-20 h-20 circle'>
              <svg
                className='w-20 h-20'
                viewBox='0 0 18 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M9 0C6.23858 0 4 2.23858 4 5C4 7.76142 6.23858 10 9 10C11.7614 10 14 7.76142 14 5C14 2.23858 11.7614 0 9 0ZM6 5C6 3.34315 7.34315 2 9 2C10.6569 2 12 3.34315 12 5C12 6.65685 10.6569 8 9 8C7.34315 8 6 6.65685 6 5Z'
                  fill='#474747'
                />
                <path
                  d='M5 12C3.67392 12 2.40215 12.5268 1.46447 13.4645C0.526784 14.4021 0 15.6739 0 17V19C0 19.5523 0.447715 20 1 20C1.55228 20 2 19.5523 2 19V17C2 16.2043 2.31607 15.4413 2.87868 14.8787C3.44129 14.3161 4.20435 14 5 14H13C13.7956 14 14.5587 14.3161 15.1213 14.8787C15.6839 15.4413 16 16.2044 16 17V19C16 19.5523 16.4477 20 17 20C17.5523 20 18 19.5523 18 19V17C18 15.6739 17.4732 14.4021 16.5355 13.4645C15.5979 12.5268 14.3261 12 13 12H5Z'
                  fill='#474747'
                />
              </svg>
            </div>
          )}
          <h3 className='text-3xl'>{alias}</h3>
        </div>
        <div className='flex'>
          {/* Info contact popup */}
          <PopUpElement icon={faPaperclip}>
            <span
              className='transition hover:bg-gray p-3'
              onClick={() => {
                /** */
              }}
            >
              More info
            </span>
          </PopUpElement>
          <PopUpElement icon={faEllipsisVertical}>
            <span
              className='transition hover:bg-gray p-3'
              onClick={() => {
                /** */
              }}
            >
              Add file
            </span>
          </PopUpElement>
        </div>
      </div>
      {/* chat area */}
      <div
        ref={chatAreaRef}
        className='w-full h-0 grow bg-white overflow-y-auto scroll-smooth '
      >
        {chat.map(
          (e: {
            mid: string;
            content: string;
            creationDate: string;
            senderId: string;
          }) => {
            if (e.senderId === user.uid) {
              return (
                <MsgBubble
                  key={e.mid}
                  content={e.content}
                  isRight={true}
                  date={e.creationDate}
                />
              );
            } else {
              return (
                <MsgBubble
                  key={e.mid}
                  content={e.content}
                  date={e.creationDate}
                />
              );
            }
          }
        )}
      </div>
      {/* Message input */}
      <div className='w-full h-24 flex justify-start items-center pl-5 pr-5 pt-3 pb-3 bg-grayDark'>
        <FontAwesomeIcon
          icon={faPaperclip}
          className='w-10 h-10 cursor-pointer p-3 transition rounded-full text-grayLight mr-3 hover:bg-gray'
        />
        <form
          className='flex w-full h-full space-x-5'
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            className='w-full rounded-xl outline-none placeholder-grayDark pl-6 pt-4 pr-4 pb-4 text-2xl  transition resize-none focus:shadow-input'
            {...register('message', { required: true })}
          />
          {/* <Input
            element='textarea'
            id='message'
            type='text'
            rows={1}
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
            value={formState.inputs.message.value}
          /> */}
          {/* <Button
            rounded={true}
            onClick={handleSubmit}
            disabled={!formState.isValid}
          >
            Send
          </Button> */}
          <label
            className={`button--rounded ${
              !dirtyFields.message ? 'button--disabled' : 'button--abled'
            }`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-1/2 h-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 fill-grayReg'
              viewBox='0 0 512 512'
            >
              <path d='M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z' />
            </svg>
            <input className='absolute inset-0' type='submit' value='' />
          </label>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
