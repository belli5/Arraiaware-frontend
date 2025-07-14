import { Fragment, useRef, useState, useLayoutEffect } from 'react';
import { Listbox, Transition, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';

export interface SelectOption {
  id: string;
  name: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  selected: SelectOption | null;
  onChange: (option: SelectOption) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  options,
  selected,
  onChange,
  placeholder = "Selecione uma opção",
  disabled = false,
}: CustomSelectProps) {


  const buttonRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (buttonRef.current) {
      setWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  return (
    <Listbox value={selected} onChange={onChange} disabled={disabled}>
      <div className="mt-1">
        <ListboxButton  ref={buttonRef} className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
          <span className={`block truncate ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
            {selected ? selected.name : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions 
            className="absolute z-50 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            style={{ width: `${width}px` }}
          >
            {options.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nenhuma opção disponível.
              </div>
            ) : (
              options.map((option) => (
                <ListboxOption
                  key={option.id}
                  className="relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 data-[active]:bg-orange-100 data-[active]:text-orange-900"
                  value={option}
                >
                  {({ selected: isSelected }) => (
                    <>
                      <span className={`block truncate ${isSelected ? 'font-medium' : 'font-normal'}`}>
                        {option.name}
                      </span>
                      {isSelected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))
            )}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}