import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

type Props = {
  selectedItem: any,
  items: any[],
  itemHeight?: number,
  visibleItems?: number,
  selectedTextStyle?: TextStyle,
  selectedItemStyle?: ViewStyle,
  primaryColor?: string,
  label?: string,
  isNumerical?: boolean,
  numberPadding?: number,
  onSelect: (newValue: any) => void,
}

export default function RollerPicker({
  selectedItem, items,
  itemHeight = 50, visibleItems = 3,
  selectedTextStyle = styles.selectedText, selectedItemStyle,
  primaryColor = "#9B41E9", label,
  isNumerical, numberPadding, onSelect,
}: Props) {
  const flatListRef = useRef<FlatList<string>>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const onScrollEnd = (e: any) => {
    if (!hasInitialized) return;

    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    flatListRef.current?.scrollToOffset({ offset: index * itemHeight, animated: true });
    onSelect(items[index]);
  };

  // Scroll to the initial selected item at first render.
  useEffect(() => {
    const timeout = setTimeout(() => {
      let indexOf = items.indexOf(selectedItem);
      if (indexOf == -1) return;
      flatListRef.current?.scrollToOffset({ offset: indexOf * itemHeight, animated: true });
      setHasInitialized(true);
    }, 250);

    return () => clearTimeout(timeout);
  }, []);

  const roller = (
    <>
      <View style={[styles.pickerContainer, {height: itemHeight * visibleItems}]}>
        <View style={[styles.highlight, {top: itemHeight * Math.floor(visibleItems / 2), height: itemHeight}]} pointerEvents="none" />

        <FlatList
          ref={flatListRef}
          data={items}
          keyExtractor={(item, index) => `${item}-${index}`}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          getItemLayout={(_, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
          })}
          contentContainerStyle={{
            paddingVertical: (itemHeight * (visibleItems - 1)) / 2,
          }}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item, index }) => (
            <View style={[styles.item, {height: itemHeight}, item === selectedItem && selectedItemStyle]}>
              <Text style={[styles.itemText, item === selectedItem && selectedTextStyle, item === selectedItem && {color: primaryColor}]}>
                {isNumerical && numberPadding != undefined ? item.toString().padStart(numberPadding, '0') : item}
              </Text>
            </View>
          )}
        />
      </View>
    </>
  )

  return (
    <>
      {label == undefined && roller}
      {label != undefined &&
        <>
          <View style={{flexDirection: "row"}}>
            {roller}
            <Text style={[{alignSelf: "center"}, selectedTextStyle, {color: primaryColor}]}>{label}{isNumerical && selectedItem as number != 1 && "s"}</Text>
          </View>
        </>
      }
    </>
  )
}

const styles = StyleSheet.create({
  pickerContainer: {
    width: "auto",
    paddingLeft: 8,
    paddingRight: 8,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 6,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#999',
  },
  selectedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  highlight: {
    position: 'absolute',
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#dee',
  },
});
