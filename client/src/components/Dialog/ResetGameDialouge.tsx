import { AlertDialog } from 'radix-ui';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetGame } from '../../redux/reducers/localGameSlice';
import { IoExitOutline } from "react-icons/io5";

const ResetGameDialog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEndGame = () => {
    dispatch(resetGame());     
    setTimeout(() => {
    navigate('/');
  }, 100);              
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          className="absolute top-4 left-4 inline-flex h-[35px] items-center justify-center bg-white px-[15px] text-gray-800 font-medium hover:bg-gray-100 focus-visible:outline focus-visible:outline-violet-600"
          title="Back to Home"
        >
          <IoExitOutline size={24}/>
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-overlayShow" />
        <AlertDialog.Content className="fixed z-50 left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
          <AlertDialog.Title className="text-lg font-semibold text-gray-800">
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-3 mb-6 text-sm text-gray-600">
            This will permanently end your current game and clear your game data.
          </AlertDialog.Description>
          <div className="flex justify-end gap-4">
            <AlertDialog.Cancel asChild>
              <button className="inline-flex h-[35px] items-center justify-center rounded bg-gray-200 px-4 text-sm font-medium text-gray-800 hover:bg-gray-300 focus-visible:outline-2 focus-visible:outline-gray-400">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={handleEndGame}
                className="inline-flex h-[35px] items-center justify-center rounded bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700"
              >
                Yes, end game
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ResetGameDialog;
