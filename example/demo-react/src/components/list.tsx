import {
  FC,
  FunctionComponent,
  ReactElement,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { createElement, createHopGroup, Flutter, HopUp } from 'hopup';

interface ListFC<P> extends FunctionComponent<P> {
  Item: typeof Item;
}
export interface ListProps {
  className?: string;
  children: Array<ReactElement<ItemProps, typeof Item>>;
}
const List: ListFC<ListProps> = (props) => {

  const { children, className } = props;
  const [list, setList] = useState(children);
  const eleRef = useRef<HTMLDivElement>(null);
  const hopUpRef = useRef<HopUp>();

  useEffect(() => {
    hopUpRef.current = createHopGroup(eleRef.current!);
  }, []);

  useEffect(() => {
    hopUpRef.current?.snapshot(true)
      .run()
      .then(() => {
        setList(children);
      });
  }, [children]);

  useLayoutEffect(() => {
    hopUpRef.current?.snapshot()
      .use(Flutter)
      .run();
  }, [list]);

  return (
    <div
      className={className}
      ref={eleRef}
    >{list}</div>
  );
}

interface ItemProps {
  className?: string;
  children?: ReactNode;
}
const Item: FC<ItemProps> = (props) => {
  const { children, className } = props;
  const ele = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ele.current) {
      createElement(ele.current);
    }
  }, []);

  return (
    <div
      className={className}
      ref={ele}
    >{children}</div>
  );
};

List.Item = Item;

export { List };

