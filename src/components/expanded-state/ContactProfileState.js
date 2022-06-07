import lang from 'i18n-js';
import React, { useCallback, useState } from 'react';
import { Keyboard } from 'react-native';
import { useNavigation } from '../../navigation/Navigation';
import { magicMemo } from '../../utils';
import ProfileModal from './profile/ProfileModal';
import useExperimentalFlag, {
  PROFILES,
} from '@rainbow-me/config/experimentalHooks';
import { maybeSignUri } from '@rainbow-me/handlers/imgix';
import { removeFirstEmojiFromString } from '@rainbow-me/helpers/emojiHandler';
import {
  useAccountSettings,
  useContacts,
  useENSProfileImages,
  usePersistentDominantColorFromImage,
} from '@rainbow-me/hooks';
const ContactProfileState = ({ address, color, contact, emoji, ens }) => {
  const profilesEnabled = useExperimentalFlag(PROFILES);
  const [nickname, setNickname] = useState(
    removeFirstEmojiFromString(contact?.nickname) || ens
  );
  const { goBack } = useNavigation();
  const { onAddOrUpdateContacts } = useContacts();

  const { network } = useAccountSettings();

  const handleAddContact = useCallback(() => {
    onAddOrUpdateContacts(address, nickname, color, network, ens);
    goBack();
    android && Keyboard.dismiss();
  }, [address, color, ens, goBack, network, nickname, onAddOrUpdateContacts]);

  const handleCancel = useCallback(() => {
    goBack();
    android && Keyboard.dismiss();
  }, [goBack]);

  const { data: images } = useENSProfileImages(ens, {
    enabled: Boolean(profilesEnabled && ens),
  });

  const avatarUrl = profilesEnabled ? images?.avatarUrl : undefined;

  const { result: dominantColor } = usePersistentDominantColorFromImage(
    maybeSignUri(avatarUrl || '') || ''
  );

  const accentColor = dominantColor || color;

  return (
    <ProfileModal
      accentColor={accentColor}
      address={address}
      emojiAvatar={emoji}
      handleCancel={handleCancel}
      handleSubmit={handleAddContact}
      imageAvatar={avatarUrl}
      inputValue={nickname}
      onChange={setNickname}
      placeholder={lang.t('contacts.input_placeholder')}
      profileName={ens}
      submitButtonText={lang.t('contacts.options.add')}
      toggleAvatar
      toggleSubmitButtonIcon={false}
    />
  );
};

export default magicMemo(ContactProfileState, ['address', 'color', 'contact']);
