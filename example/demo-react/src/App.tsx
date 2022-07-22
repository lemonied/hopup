import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import json from '../../champion.json';
import { List } from './components/list';
import styles from './App.module.scss';

const filters = [
  { label: '全部', value: 'all' },
  { label: 'Fighter', value: 'Fighter' },
  { label: 'Tank', value: 'Tank' },
  { label: 'Mage', value: 'Mage' },
  { label: 'Assassin', value: 'Assassin' },
];

interface FilterProps {
  onChange?(tag: string): void;
  value?: string;
}
const Filter: FC<FilterProps> = (props) => {

  const { onChange, value = 'all' } = props;
  const [val, setVal] = useState(value);

  useEffect(() => {
    setVal(value);
  }, [value]);

  const handleClick = useCallback((tag: string) => {
    setVal(tag);
    onChange?.(tag);
  }, [onChange]);

  return (
    <div>
      {
        filters.map((v, k) => {
          return (
            <button onClick={() => handleClick(v.value)} key={k}>{v.label}</button>
          );
        })
      }
    </div>
  );
};

function App() {

  const originData = useMemo(() => {
    return Object.keys(json.data).map(key => {
      return (json.data as any)[key as string];
    });
  }, []);

  const [filtered, setFiltered] = useState(originData);

  const handleOnChange = useCallback((tag: string) => {
    setFiltered(originData.filter(v => tag === 'all' || v.tags.includes(tag)));
  }, [originData]);

  return (
    <div className="App">
      <Filter onChange={handleOnChange} />
      <List className={styles['list']}>
        {
          filtered.map(v => {
            return (
              <List.Item
                key={v.id}
                className={styles['item']}
              >
                <img src={`https://cdngarenanow-a.akamaihd.net/games/lol/2020/LOLwebsite/champion/${v.id}_0.jpg`} alt={v.name}/>
              </List.Item>
            );
          })
        }
      </List>
    </div>
  );
}

export default App;
