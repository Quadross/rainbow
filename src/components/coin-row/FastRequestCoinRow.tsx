import { addHours, differenceInMinutes, isPast } from 'date-fns';
import lang from 'i18n-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ButtonPressAnimation } from '../animations';
import { FastRequestCoinIcon } from '../coin-icon';
import { Text } from '@rainbow-me/design-system';
import { useNavigation } from '@rainbow-me/navigation';
import { removeRequest } from '@rainbow-me/redux/requests';
import Routes from '@rainbow-me/routes';
import { ThemeContextProps } from '@rainbow-me/theme';

const cx = StyleSheet.create({
  bottomRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 8,
  },
  topRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  wholeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 19,
  },
});

const getPercentageOfTimeElapsed = (startDate: Date, endDate: Date) => {
  const originalDifference = differenceInMinutes(endDate, startDate);
  const currentDifference = differenceInMinutes(endDate, Date.now());

  return Math.floor((currentDifference * 100) / originalDifference);
};

export default React.memo(function RequestCoinRow({
  item,
  theme,
}: {
  item: any;
  theme: ThemeContextProps;
}) {
  const buttonRef = useRef();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  // const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  // const [expirationColor, setExpirationColor] = useState<string>('');
  // const [percentElapsed, setPercentElapsed] = useState<number>(0);

  const [state, setState] = useState<{
    expirationColor: string;
    expiresAt: Date | null;
    percentElapsed: number;
  }>({
    expirationColor: '',
    expiresAt: null,
    percentElapsed: 0,
  });

  const { colors } = theme;

  const minutes =
    state.expiresAt && differenceInMinutes(state.expiresAt, Date.now());

  useEffect(() => {
    if (item?.displayDetails?.timestampInMs) {
      const createdAt = new Date(item.displayDetails.timestampInMs);
      const expiresAt = addHours(createdAt, 1);
      const percentElapsed = getPercentageOfTimeElapsed(createdAt, expiresAt);

      setState({
        expirationColor: percentElapsed > 25 ? colors.appleBlue : colors.orange,
        expiresAt,
        percentElapsed,
      });
    }
  }, [colors, item]);

  const handleExpiredRequests = useCallback(() => {
    if (state.expiresAt && isPast(state.expiresAt)) {
      dispatch(removeRequest(item.requestId));
    }
  }, [dispatch, state.expiresAt, item.requestId]);

  const handlePressOpen = useCallback(() => {
    navigate(Routes.CONFIRM_REQUEST, {
      transactionDetails: item,
    });
  }, [item, navigate]);

  useEffect(() => {
    handleExpiredRequests();
  }, [state.expiresAt, handleExpiredRequests]);

  return (
    <ButtonPressAnimation
      onPress={handlePressOpen}
      scaleTo={0.98}
      waitFor={buttonRef}
    >
      <View style={cx.wholeRow}>
        <FastRequestCoinIcon
          dappName={item.dappName}
          expirationColor={state.expirationColor}
          imageUrl={item.imageUrl}
          percentElapsed={state.percentElapsed}
          theme={theme}
        />
        <View style={cx.column}>
          <View style={cx.topRow}>
            <Text
              color={{ custom: state.expirationColor }}
              containsEmoji
              size="14px"
              weight="semibold"
            >
              🕓{' '}
              {lang.t('exchange.coin_row.expires_in', {
                minutes: minutes || 0,
              })}
            </Text>
          </View>
          <View style={cx.bottomRow}>
            <Text
              color={{ custom: state.expirationColor }}
              size="16px"
              weight="semibold"
            >
              {item.dappName}
            </Text>
          </View>
        </View>
      </View>
    </ButtonPressAnimation>
  );
});
