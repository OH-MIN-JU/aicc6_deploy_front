import React, { useEffect, useState } from 'react';
import Item from './Item';
import { useDispatch, useSelector } from 'react-redux';
import AddItem from './AddItem';
import PageTitle from './PageTitle';
import { fetchGetItems } from '../../redux/slices/apiSlice';
import { SkeletonTheme } from 'react-loading-skeleton';
import LoadingSkeleton from './LoadingSkeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from './Modal';

const ItemPanel = ({ pageTitle, filteredCompleted, filteredImportant }) => {
  // Auth Data Variables
  const authData = useSelector((state) => state.auth.authData);
  const userKey = authData?.sub;
  // console.log(userKey); 115170568560560904112

  // API Data Variables
  const getTasksData = useSelector((state) => state.api.getItemsData);
  const dispatch = useDispatch();

  // Loading state
  const [loading, setLoading] = useState(false);

  // modal state
  const isOpen = useSelector((state) => state.modal.isOpen);

  useEffect(() => {
    if (!userKey) return;

    const fetchGetItemsData = async () => {
      try {
        setLoading(true);
        // useEffect 내부에서 dispatch 함수를 호출할 때는 async/await를 사용할 수 없을 때 unwrap()을 사용;
        await dispatch(fetchGetItems(userKey)).unwrap();
      } catch (error) {
        console.log('Fail to fetch items', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGetItemsData();
  }, [dispatch, userKey]);

  // console.log(getTasksData);

  // 1. home 메뉴를 서택할 때:
  // - all메뉴를 선택하면 첫 번째 filter 조건이 true이므로 모든 task를 반환
  // - 1번에서 반환된 모든 tasks를 대상으로 두 번째 filter 조건을 적용
  // - filterImportant가 undefined이면 조건이 true 이므로 모든 task를 반환

  // 2. Completed 메뉴를 선택할 때:
  // - 첫 번째 필터 조건에서 if문이 false이므로 return 문으로 이동하여 filterCompleted 조건을 판단
  // - filterCompleted가 true이면 task.iscompleled가 true인 task만 반환

  // 3. Proceeding 메뉴를 선택할 때:
  // - 첫 번째 필터 조건에서 if문이 false이므로 return 문으로 이동하여 filterCompleted 조건을 판단
  // - filterCompleted가 false이면 task.iscompleled가 false인 task만 반환

  // 4. Important 메뉴를 선택할 때:
  // - 첫 번째 필터 조건에서 if문이 true이므로 두 번째 필터 조건으로 이동
  // - 두 번째 filter 조건에서 filterImportant가 없으면 true이므로 모든 task를 반환(home, Completed, Proceeding과 동일)
  // - filterImportant가 true이면 task.isimportant가 true인 task만 반환

  const filteredTasks = getTasksData
    ?.filter((task) => {
      if (filteredCompleted === 'all') return true;
      return filteredCompleted ? task.iscompleted : !task.iscompleted;
    })
    .filter((task) => {
      if (filteredImportant === undefined) return true;
      return filteredImportant ? task.isImportant : !task.isimportant;
    });

  // console.log(filteredTasks);
  return (
    <div className="panel bg-[#212121] w-4/5 h-full rounded-md border border-gray-500 py-5 px-4 overflow-y-auto">
      {userKey ? (
        <div className="login-message w-full h-full">
          {isOpen && <Modal />}
          <PageTitle title={pageTitle} />
          <div className="flex flex-wrap">
            {/* {getTasksData?.map((task, idx) => (
              <Item key={idx} task={task} />
            ))} */}

            {loading ? (
              <SkeletonTheme
                baseColor="#202020"
                highlightColor="#444"
                height="25vh"
              >
                {/* {[...Array(getTasksData?.length)].map((_, idx) => (
                  <LoadingSkeleton key={idx} />
                ))} */}
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
              </SkeletonTheme>
            ) : (
              filteredTasks?.map((task, idx) => <Item key={idx} task={task} />)
            )}

            <AddItem />
          </div>
        </div>
      ) : (
        <div className="login-message w-full h-full flex items-center justify-center">
          <button className="flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-2 px-4 rounded-md">
            <span className="text-sm font-semibold">
              로그인이 필요한 서비스입니다.
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemPanel;
