import React, { useCallback, useRef } from "react";
import { ListRenderItem, FlatList } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ItemHeight, ScreenHeight } from "./constants";
import { data } from "./data";
import { IItem } from "./types";
import MessageCard from "./components/MessageCard";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<IItem>);

const keyExtractor = (item: IItem) => item.name;
const getItemLayout = (_: any, index: number) => ({
  length: ItemHeight,
  offset: ItemHeight * index,
  index,
});

const Main = () => {
  const ref = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const scrollOffset = useSharedValue(0);

  const maxScrollOffset = useDerivedValue(
    () =>
      insets.top +
      insets.bottom +
      data.length * ItemHeight +
      100 -
      ScreenHeight,
    [insets.top, insets.bottom]
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (ev) => {
      scrollOffset.value = ev.contentOffset.y;
    },
  });

  const renderItem: ListRenderItem<IItem> = useCallback(({ item, index }) => {
    return (
      <MessageCard
        itemsNumber={data.length}
        maxScrollOffset={maxScrollOffset}
        scrollOffset={scrollOffset}
        item={item}
        index={index}
      />
    );
  }, []);

  return (
    <AnimatedFlatList
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={[
        {
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
          paddingHorizontal: 16,
        },
      ]}
      ref={ref}
      initialNumToRender={Math.round(ScreenHeight / 40)}
      getItemLayout={getItemLayout}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

export default Main;
