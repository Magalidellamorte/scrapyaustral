import config from '../config/config';

const getProfilePicturePath = (
  user,
  background = 'e2fef1',
  color = '353535'
) => {
  if (user?.profile_picture_path) {
    return `${config.STORAGE_PATH}${user?.profile_picture_path}`;
  }

  const getFirstLetter = (name) => (name ? name[0] : '?');

  let link = '';
  if(user?.is_company && user?.company_title){
    link = `https://ui-avatars.com/api/?name=${getFirstLetter(
      user?.company_title
    )}&size=250&background=${background}&color=${color}&bold=true`
  }else{
    link = `https://ui-avatars.com/api/?name=${getFirstLetter(
      user?.first_name
    )}${getFirstLetter(
      user?.last_name
    )}&size=250&background=${background}&color=${color}&bold=true`
  }
  
  return link;
};

export default getProfilePicturePath;
