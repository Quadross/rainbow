import React from 'react';
import { Text as RNText, StyleSheet, View } from 'react-native';
import {
  // @ts-ignore
  IS_TESTING,
} from 'react-native-dotenv';
// @ts-ignore
import { ContextMenuButton } from 'react-native-ios-context-menu';
import RadialGradient from 'react-native-radial-gradient';
import { ButtonPressAnimation } from '../../../animations';
import { CoinRowHeight } from '../../../coin-row';
import FastCoinIcon from './FastCoinIcon';
import { Text } from '@rainbow-me/design-system';
import { useAccountAsset } from '@rainbow-me/hooks';
import {
  borders,
  colors,
  fonts,
  fontWithWidth,
  padding,
} from '@rainbow-me/styles';
import { isETH } from '@rainbow-me/utils';

const SafeRadialGradient = (IS_TESTING === 'true'
  ? View
  : RadialGradient) as typeof RadialGradient;

export default React.memo(function FastCurrencySelectionRow({
  item: {
    uniqueId,
    showBalance,
    showFavoriteButton,
    showAddButton,
    onPress,
    theme,
    nativeCurrency,
    nativeCurrencySymbol,
    favorite,
    toggleFavorite,
    contextMenuProps,
    symbol,
    address,
    name,
  },
}: {
  item: any;
}) {
  const { isDarkMode } = theme;

  // TODO
  const item = useAccountAsset(uniqueId, nativeCurrency);

  return (
    <View style={{ flexDirection: 'row', width: '100%' }}>
      <ButtonPressAnimation
        onPress={onPress}
        style={{ flex: 1 }}
        wrapperStyle={{
          flex: 1,
        }}
      >
        <View style={[cx.rootContainer, { flex: 1, width: '100%' }]}>
          <FastCoinIcon
            address={item?.mainnet_address || item?.address || address}
            symbol={item?.symbol || symbol}
            theme={theme}
          />
          <View style={cx.innerContainer}>
            <View
              style={[
                cx.column,
                {
                  height: 33,
                  justifyContent: showBalance ? 'center' : 'space-between',
                },
              ]}
            >
              <Text align="left" numberOfLines={1} size="16px" weight="medium">
                {item?.name || name}
              </Text>
              {!showBalance && (
                <Text
                  align="left"
                  color={{ custom: theme.colors.blueGreyDark50 }}
                  numberOfLines={1}
                  size="14px"
                  weight="medium"
                >
                  {item?.symbol || symbol}
                </Text>
              )}
            </View>
            {showBalance && (
              <View style={[cx.column, { height: 33 }]}>
                <Text align="right" size="16px">
                  {item?.native?.balance?.display ??
                    `${nativeCurrencySymbol}0.00`}
                </Text>
                <Text
                  align="right"
                  color={{ custom: theme.colors.blueGreyDark50 }}
                  size="14px"
                >
                  {item?.balance?.display ?? ''}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ButtonPressAnimation>
      {!showBalance && (
        <View style={[cx.fav]}>
          {(!item?.isNativeAsset || isETH(item?.address)) && !showBalance && (
            <ContextMenuButton
              activeOpacity={0}
              isMenuPrimaryAction
              useActionSheetFallback={false}
              wrapNativeComponent={false}
              {...contextMenuProps}
            >
              <ButtonPressAnimation>
                <SafeRadialGradient
                  center={[0, 15]}
                  colors={colors.gradients.lightestGrey}
                  style={{
                    alignItems: 'center',
                    borderRadius: 15,
                    height: 30,
                    justifyContent: 'center',
                    overflow: 'hidden',
                    paddingBottom: 5,
                    width: 30,
                  }}
                >
                  <RNText
                    style={{
                      color: colors.alpha(colors.blueGreyDark, 0.3),
                      fontSize: 16,
                      letterSpacing: 0,
                      textAlign: 'center',
                      ...fontWithWidth(fonts.weight.bold),
                      height: '100%',
                      lineHeight: 30,
                      width: '100%',
                    }}
                  >
                    􀅳
                  </RNText>
                </SafeRadialGradient>
              </ButtonPressAnimation>
            </ContextMenuButton>
          )}
          {showFavoriteButton && (
            <ButtonPressAnimation onPress={toggleFavorite}>
              <SafeRadialGradient
                center={[0, 15]}
                colors={
                  favorite
                    ? [
                        colors.alpha('#FFB200', isDarkMode ? 0.15 : 0),
                        colors.alpha('#FFB200', isDarkMode ? 0.05 : 0.2),
                      ]
                    : colors.gradients.lightestGrey
                }
                style={{
                  alignItems: 'center',
                  borderRadius: 15,
                  height: 30,
                  justifyContent: 'center',
                  overflow: 'hidden',
                  paddingBottom: 5,
                  width: 30,
                }}
              >
                <Text
                  color={{
                    custom: favorite
                      ? colors.yellowFavorite
                      : colors.alpha(colors.blueGreyDark, 0.2),
                  }}
                >
                  􀋃
                </Text>
              </SafeRadialGradient>
            </ButtonPressAnimation>
          )}
          {showAddButton && (
            <ButtonPressAnimation onPress={toggleFavorite}>
              <SafeRadialGradient
                center={[0, 15]}
                colors={colors.gradients.lightestGrey}
                style={{
                  alignItems: 'center',
                  borderRadius: 15,
                  height: 30,
                  justifyContent: 'center',
                  overflow: 'hidden',
                  paddingBottom: 5,
                  width: 30,
                }}
              >
                <Text
                  color={{
                    custom: colors.alpha(colors.blueGreyDark, 0.3),
                  }}
                  size="16px"
                  weight="bold"
                >
                  +
                </Text>
              </SafeRadialGradient>
            </ButtonPressAnimation>
          )}
        </View>
      )}
    </View>
  );
});

const cx = StyleSheet.create({
  bottom: {
    marginTop: 12,
  },
  center: {
    justifyContent: 'center',
  },
  checkboxContainer: {
    width: 51,
  },
  checkboxInnerContainer: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 40,
    justifyContent: 'center',
    width: 51,
  },
  checkmarkBackground: {
    ...borders.buildCircleAsObject(22),
    ...padding.object(4.5),
    backgroundColor: colors.appleBlue,
    left: 19,
    position: 'absolute',
  },
  circleOutline: {
    ...borders.buildCircleAsObject(22),
    borderWidth: 1.5,
    left: 19,
    position: 'absolute',
  },
  coinIconFallback: {
    backgroundColor: '#25292E',
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  coinIconIndicator: {
    left: 19,
    position: 'absolute',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  container: {
    flexDirection: 'row',
    marginLeft: 2,
    marginRight: 19,
    marginVertical: 9.5,
  },
  fav: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
    width: 92,
  },
  flex: {
    flex: 1,
  },
  hiddenRow: {
    opacity: 0.4,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    width: '100%',
  },
  nonEditMode: {
    paddingHorizontal: 19,
  },
  rootContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: CoinRowHeight,
    paddingHorizontal: 19,
  },
});
