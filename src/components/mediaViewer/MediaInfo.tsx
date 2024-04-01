import React, { memo } from '../../lib/teact/teact';
import { withGlobal } from '../../global';

import { MediaType } from '../../global/types';

import { GETGEMS_BASE_MAINNET_URL, GETGEMS_BASE_TESTNET_URL } from '../../config';
import { selectCurrentAccountState } from '../../global/selectors';
import buildClassName from '../../util/buildClassName';
import { shortenAddress } from '../../util/shortenAddress';

import useLang from '../../hooks/useLang';

import styles from './MediaViewer.module.scss';

type OwnProps = {
  mediaId?: string;
};

type StateProps = {
  title?: string;
  description?: string;
  descriptionUrl?: string;
};

function MediaInfo({ title, description, descriptionUrl }: StateProps) {
  const lang = useLang();

  return (
    <div className={styles.mediaInfo}>
      <span className={styles.mediaInfoTitle}>{title}</span>
      <a
        href={descriptionUrl}
        target="_blank"
        aria-label={lang('Open NFT Collection')}
        className={styles.mediaInfoDescription}
        rel="noreferrer"
      >
        <span className={styles.descriptionText}>{description}</span>
        <i className={buildClassName('icon-tooltip', styles.tooltip)} aria-hidden />
      </a>
    </div>
  );
}

export default memo(withGlobal<OwnProps>((global, { mediaId }): StateProps => {
  if (!mediaId) return {};

  const { mediaType = MediaType.Nft } = global.mediaViewer || {};
  const isTestnet = global.settings.isTestnet;

  const getGemsBaseUrl = isTestnet ? GETGEMS_BASE_TESTNET_URL : GETGEMS_BASE_MAINNET_URL;

  if (mediaType === MediaType.Nft) {
    const { byAddress } = selectCurrentAccountState(global)?.nfts || {};
    const nft = byAddress?.[mediaId];
    if (!nft) return {};

    return {
      title: nft.name || shortenAddress(nft.address, 4),
      description: nft.collectionName,
      descriptionUrl: `${getGemsBaseUrl}collection/${nft.collectionAddress}`,
    };
  }

  return {};
})(MediaInfo));
