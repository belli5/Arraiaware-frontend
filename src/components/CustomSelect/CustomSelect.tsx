import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
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

export default function CustomSelect({ options, selected, onChange, placeholder = "Selecione uma opção", disabled = false,}: CustomSelectProps) {
  return (
    <Listbox value={selected} onChange={onChange} disabled={disabled}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
          <span className={`block truncate ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
            {selected ? selected.name : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nenhuma opção disponível.
              </div>
            ) : (
              options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-orange-100 text-orange-900' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}