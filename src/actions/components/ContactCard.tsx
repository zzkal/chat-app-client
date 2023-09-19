import { toggleChatPanel } from '../redux/chatPanel/chatPanelSlice';
import { fetchChatWithAContact } from '../redux/chat/chatSlice';
import { selectUser } from '../redux/user/userSelector';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import React from 'react';

interface IContactCard {
  contactId: string;
  alias: string;
  email: string;
  profileImage: string;
}

const ContactCard: React.FC<IContactCard> = ({
  contactId,
  alias,
  email,
  profileImage,
}) => {
  const { user } = useSelector(selectUser);

  const dispatch = useDispatch<AppDispatch>();

  const handleChat = () => {
    const members = [{ email }, { email: user.email }];
    dispatch(fetchChatWithAContact({ alias: null, members }));
    dispatch(toggleChatPanel(true));
  };

  return (
    <div
      className={`bg-grayLight flex justify-start items-center space-x-14 w-full p-8 cursor-pointer transition hover:bg-zinc-400`}
      onClick={handleChat}
    >
      {profileImage ? (
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${profileImage}`}
          alt={`${alias}/image`}
          className='w-20 h-20 rounded-full object-cover'
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
      <div className='flex flex-col'>
        <h2 className='text-2xl font-bold'>{alias}</h2>
        <h3 className='text-xl font-medium'>{email}</h3>
      </div>
    </div>
  );
};

export default ContactCard;
