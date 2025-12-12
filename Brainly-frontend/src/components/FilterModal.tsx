import { CiSquareMinus } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  categories: [];
  selectedCategories: [];
  onSelectedCategories:()=>void;
}

const FilterModal = ({ open, onClose, categories, selectedCategories, onSelectedCategories }:FilterModalProps) => {
    if (!open) return null;
    return (
        <div className='modal select-none bg-black'>
            <div className='box absolute bg-linear-to-b from-gray-100 to-white right-[4%] w-1/6'>
                <div className='inner-box bg-linear-to-t from-gray-200 to-white flex flex-col justify-center p-5 rounded-[7px]'>
                    {
                        categories.map((cat) => {
                            const isSelected = selectedCategories.includes(cat);
                            return (
                                <div
                                    key={cat}
                                    //onClick={()=> onSelectedCategory(cat)}
                                    className={isSelected ? "" : ""}
                                >
                                    <div className='flex justify-between items-center mb-3'>
                                        <h3 className='capitalize '>{cat}</h3>
                                        <div onClick={() => onSelectedCategories(cat)} className='checkbox border-1 border-white w-[25px] h-[25px] rounded-[4px] flex items-center justify-center bg-purple-300 text-2xl cursor-pointer'>
                                            {isSelected ? <CiSquareMinus/> : <CiSquarePlus/>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    {/* /*CLOSE BUTTON */}

                </div>

                <div className='flex justify-end mb-2'>
                    <button
                        onClick={onClose}
                        className='mt-2 text-sm text-right flex text-white bg-purple-700 w-fit cursor-pointer p-1'
                    >
                        X
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FilterModal