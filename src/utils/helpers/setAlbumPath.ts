import { cloudinaryFolders } from '../../enums';

export function setAlbumPath(profileId : number, albumTitle : string) {
    return `${cloudinaryFolders.albums}/profile_${profileId}/${albumTitle}`;
}
