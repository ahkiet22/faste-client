'use client';

type TInputNumberCustomProps = {
  value: number;
  setValue: (val: number) => void;
  min?: number;
  max?: number;
};

export default function InputNumberCustom({
  value,
  setValue,
  min = 0,
  max = Infinity,
}: TInputNumberCustomProps) {

  // console.log('render input number custom');

   const handleDecrease = () => {
    setValue(Math.max(min, value - 1));
  };

  const handleIncrease = () => {
    setValue(Math.min(max, value + 1));
  };

  return (
    <div className="flex items-center border border-gray-300 rounded w-28">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= 1}
        className="w-8 h-[45px] flex items-center justify-center border-r border-gray-300 hover:bg-gray-100"
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        step={1}
        min={min}
        max={max}
        className="h-[45px] w-12 text-center outline-none [appearance:textfield] 
          [&::-webkit-inner-spin-button]:appearance-none 
          [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        disabled={value === max}
        onClick={handleIncrease}
        className="w-8 h-[45px] flex items-center justify-center border-l border-gray-300 hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
}
