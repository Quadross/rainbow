import analytics from '@segment/analytics-react-native';
import lang from 'i18n-js';
import React, { useCallback, useState } from 'react';
import { InteractionManager } from 'react-native';
import ProfileModal from './profile/ProfileModal';
import { removeFirstEmojiFromString } from '@rainbow-me/helpers/emojiHandler';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
export default function WalletProfileState({
  actionType,
  address,
  isNewProfile,
  onCloseModal,
  profile,
}) {
  const { goBack, navigate } = useNavigation();
  const { name, color, image, emoji } = profile;

  const [value, setValue] = useState(
    name ? removeFirstEmojiFromString(name) : ''
  );

  const handleCancel = useCallback(() => {
    goBack();
    analytics.track('Tapped "Cancel" on Wallet Profile modal');
    if (actionType === 'Create') {
      navigate(Routes.CHANGE_WALLET_SHEET);
    }
  }, [actionType, goBack, navigate]);

  const handleSubmit = useCallback(() => {
    analytics.track('Tapped "Submit" on Wallet Profile modal');
    InteractionManager.runAfterInteractions(() => {
      onCloseModal({
        color: color,
        image: image,
        name: emoji ? `${emoji} ${value}` : value,
      });
      goBack();
      if (actionType === 'Create' && isNewProfile) {
        navigate(Routes.CHANGE_WALLET_SHEET);
      }
    });
  }, [
    actionType,
    color,
    goBack,
    isNewProfile,
    emoji,
    navigate,
    onCloseModal,
    image,
    value,
  ]);

  return (
    <ProfileModal
      accentColor={color}
      address={address}
      emojiAvatar={emoji}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      imageAvatar={image}
      inputValue={value}
      onChange={setValue}
      placeholder={lang.t('wallet.new.name_wallet')}
      submitButtonText={
        isNewProfile
          ? actionType === 'Create'
            ? lang.t('wallet.new.create_wallet')
            : lang.t('wallet.new.import_wallet')
          : lang.t('button.done')
      }
      toggleAvatar={!isNewProfile || address}
      toggleSubmitButtonIcon={actionType === 'Create'}
    />
  );
}
