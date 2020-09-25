import React, {useRef, useState} from 'react';
import {Animated, Dimensions, LayoutChangeEvent, PanResponder, StyleSheet, Text, View} from "react-native";

export type WorkoutScreenSwipeNavigationProps = {
  navigation: any
};

const windowWidth = Math.round(Dimensions.get('window').width);
const windowHeight = Math.round(Dimensions.get('window').height);

const WorkoutSwipeLayout2Screen = (props: WorkoutScreenSwipeNavigationProps) => {
  const [layoutDimensions, setLayoutDimensions] = useState({width: 0, height: 0});

  let panScreenPrimary = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  let panScreenSecondary = useRef(new Animated.ValueXY({x: windowWidth, y: 0})).current;

  let currentMoveDirection: 'x' | 'y' | undefined;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
      },
      onPanResponderMove: (e, gestureState) => {
        const bounceGapValueX = Math.abs(gestureState.dx);
        const bounceGapValueY = Math.abs(gestureState.dy);

        if ((bounceGapValueX < 50) && (bounceGapValueY < 50))
          return;

        if (currentMoveDirection === undefined) {
          currentMoveDirection = bounceGapValueX > bounceGapValueY ? 'x' : 'y';
        }

        if (currentMoveDirection === 'x') {
          const swipeDirection = gestureState.dx > 0 ? -1 : 1;
          panScreenPrimary.x.setValue(gestureState.dx + (50 * swipeDirection));
          panScreenSecondary.y.setValue(0);
          panScreenSecondary.x.setValue((swipeDirection * windowWidth) + gestureState.dx + (50 * swipeDirection));
        } else {
          const swipeDirection = gestureState.dy > 0 ? -1 : 1;
          panScreenPrimary.y.setValue(gestureState.dy + (50 * swipeDirection));
          panScreenSecondary.x.setValue(0);
          panScreenSecondary.y.setValue((swipeDirection * windowHeight) + gestureState.dy + (50 * swipeDirection));
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        const bounceGapValueX = Math.abs(gestureState.dx);
        const bounceGapValueY = Math.abs(gestureState.dy);

        if ((bounceGapValueX < 50) && (bounceGapValueY < 50))
          return;

        if (currentMoveDirection === 'x') {
          const swipeDirection = gestureState.dx > 0 ? -windowWidth : windowWidth;
          const swipeThreshold = windowWidth / 2;
          const isSwipedThreshold = Math.abs(gestureState.dx) >= swipeThreshold;

          if (isSwipedThreshold) {
            const temp = panScreenPrimary;
            panScreenPrimary = panScreenSecondary;
            panScreenSecondary = temp;
          }

          Animated.timing(panScreenPrimary.x, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start();

          Animated.timing(panScreenSecondary.x, {
            toValue: isSwipedThreshold ? (swipeDirection * -1) : swipeDirection,
            duration: 250,
            useNativeDriver: true,
          }).start();

        } else {
          const swipeDirection = gestureState.dy > 0 ? -windowHeight : windowHeight;
          const swipeThreshold = windowHeight / 4;
          const isSwipedThreshold = Math.abs(gestureState.dy) >= swipeThreshold;

          if (isSwipedThreshold) {
            const temp = panScreenPrimary;
            panScreenPrimary = panScreenSecondary;
            panScreenSecondary = temp;
          }

          Animated.timing(panScreenPrimary.y, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }).start();

          Animated.timing(panScreenSecondary.y, {
            toValue: isSwipedThreshold ? (swipeDirection * -1) : swipeDirection,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }

        currentMoveDirection = undefined;
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const {height, width} = e.nativeEvent.layout;
    setLayoutDimensions({
      height: Math.round(height),
      width: Math.round(width)
    })
  };

  return (
    <View
      style={styles.layout}
      onLayout={onLayout}>
      <Text>layout width: {layoutDimensions.width}</Text>
      <Text>layout height: {layoutDimensions.height}</Text>

      <Animated.View style={{...styles.screenPrimary, ...{transform: [{ translateX: panScreenPrimary.x }, {translateY: panScreenPrimary.y}]}}} {...panResponder.panHandlers}>
        <Text>screenPrimary</Text>
      </Animated.View>

      <Animated.View style={{...styles.screenSecondary, ...{transform: [{ translateX: panScreenSecondary.x}, {translateY: panScreenSecondary.y}]}}} {...panResponder.panHandlers}>
        <Text>screenSecondary</Text>
      </Animated.View>
    </View>
  );
};


export default WorkoutSwipeLayout2Screen;

const styles = StyleSheet.create({
  layout: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gold',
  },
  screenPrimary: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center'
  },
  screenSecondary: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'olivedrab',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
