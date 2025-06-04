import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io'; // 닫기 아이콘
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/slices/modalSlice';
import {
  fetchGetItems,
  fetchPostItem,
  fetchPutItem,
} from '../../redux/slices/apiSlice'; //
import { toast } from 'react-toastify';

const Modal = () => {
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const { modalType, task } = useSelector((state) => state.modal);
  const user = useSelector((state) => state.auth.authData);
  // console.log(user?.sub);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    isCompleted: false,
    isImportant: false,
    userId: user?.sub,
  });

  useEffect(() => {
    if ((modalType === 'update' && task) || (modalType === 'details' && task)) {
      setFormData({
        title: task.title,
        description: task.description,
        date: task.date,
        isCompleted: task.iscompleted,
        isImportant: task.isimportant,
        _id: task._id,
      });
    } else if (modalType === 'create' && task === null) {
      setFormData({
        title: '',
        description: '',
        date: '',
        isCompleted: false,
        isImportant: false,
        userId: user?.sub,
      });
    }
  }, [modalType, task, user?.sub]);

  // 모달 타입에 따라 모달 내용 변경
  const showModalContents = (modalType, str1, str2, str3) => {
    switch (modalType) {
      case 'update':
        return str1;
      case 'details':
        return str2;
      default:
        return str3;
    }
  };

  const modalTitle = showModalContents(
    modalType,
    '할 일 수정하기',
    '할 일 상세보기',
    '할 일 추가하기'
  );

  const modalBtn = showModalContents(
    modalType,
    '할 일 수정하기',
    '',
    '할 일 추가하기'
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log(name, value, type, checked);
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 디폴트 기능 방지

    if (!user.sub) {
      toast.error('잘못된 사용자입니다.');
      return;
    }

    if (!formData.title) {
      toast.error('제목을 입력해 주세요.');
      return;
    }

    if (!formData.description) {
      toast.error('내용을 입력해 주세요.');
      return;
    }

    if (!formData.date) {
      toast.error('날짜를 입력해 주세요.');
      return;
    }

    // console.log(formData);
    // console.log(modalType);

    try {
      if (modalType === 'create' && task === null) {
        await dispatch(fetchPostItem(formData)).unwrap();
        toast.success('할 일이 추가되었습니다.');
      } else if (modalType === 'update' && task) {
        await dispatch(fetchPutItem(formData)).unwrap();
        toast.success('할 일이 수정되었습니다.');
      }

      handleCloseModal();

      await dispatch(fetchGetItems(user?.sub)).unwrap();
    } catch (error) {
      console.log('Error: ', error);
      toast.error('할 일을 추가하는데 실패했습니다.');
    }
  };
  return (
    <div className="modal fixed bg-black bg-opacity-50 flex items-center justify-center w-full h-full left-0 top-0 z-50 ">
      <div className="form-wrapper bg-gray-700 rounded-md w-1/2 flex flex-col items-center relative p-4">
        <h2 className="text-2xl py-2 border-b border-gray-300 w-fit font-semibold">
          {modalTitle}
        </h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="input-control">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력해 주세요..."
              {...(modalType === 'details' && { disabled: true })}
            />
          </div>
          <div className="input-control">
            <label htmlFor="description">내용</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="내용을 입력해 주세요..."
              {...(modalType === 'details' && { disabled: true })}
            ></textarea>
          </div>
          <div className="input-control">
            <label htmlFor="date">입력 날짜</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              {...(modalType === 'details' && { disabled: true })}
            />
          </div>
          <div className="input-control toggler">
            <label htmlFor="isCompleted">완료 여부</label>
            <input
              type="checkbox"
              id="isCompleted"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleChange}
              {...(modalType === 'details' && { disabled: true })}
            />
          </div>
          <div className="input-control toggler">
            <label htmlFor="isImportant">중요성 여부</label>
            <input
              type="checkbox"
              id="isImportant"
              name="isImportant"
              checked={formData.isImportant}
              onChange={handleChange}
              {...(modalType === 'details' && { disabled: true })}
            />
          </div>
          <div className="submit-btn flex justify-end">
            <button
              type="submit"
              className={`flex justify-end bg-black py-3 px-6 rounded-md hover:bg-slate-900 ${
                modalType === 'details' ? 'hidden' : ''
              }`}
            >
              {modalBtn}
            </button>
          </div>
        </form>

        <IoMdClose
          className="absolute right-10 top-10 cursor-pointer"
          onClick={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Modal;
