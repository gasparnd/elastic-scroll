import React, { FC } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import * as constants from "../constants";
import { IItem } from "../types";

interface IItemsProps {
  item: IItem;
  index: number;
  scrollOffset: SharedValue<number>;
  maxScrollOffset: SharedValue<number>;
  itemsNumber: number;
}

const MessageCard: FC<IItemsProps> = ({
  item,
  index,
  scrollOffset,
  maxScrollOffset,
  itemsNumber,
}) => {
  const { image, name, message, online, read } = item;

  const animatedElasticStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-15, 0, maxScrollOffset.value, (maxScrollOffset.value = 15)],
          [index * 2, 0, 0, (index - itemsNumber - 1) * 2],
          Extrapolation.EXTEND
        ),
      },
    ],
  }));

  return (
    <Animated.View
      key={item.name}
      style={[
        animatedElasticStyles,
        styles.wrapper,
        { height: constants.ItemHeight },
      ]}
    >
      <View style={styles.container}>
        <View>
          <Image source={{ uri: image }} style={styles.image} />
          {online && <View style={styles.onlineIndicator} />}
        </View>

        <View>
          <Text style={styles.nameText}>{name}</Text>
          <Text
            style={[
              styles.messageText,
              {
                color: read ? "#f4f4f4" : "#EFEFEF",
                fontWeight: read ? "400" : "bold",
              },
            ]}
          >
            {message}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: "center" },
  container: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
  },
  image: { height: 60, width: 60, borderRadius: 100, marginRight: 10 },
  onlineIndicator: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#34c759",
    position: "absolute",
    bottom: 0,
    right: 10,
  },
  nameText: {
    fontWeight: "bold",
    color: "#f4f4f4",
    fontSize: 17,
    marginBottom: 6,
  },
  messageText: { fontSize: 14 },
});

export default MessageCard;
