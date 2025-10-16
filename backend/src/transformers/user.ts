export const transformUser = (user: any) => {
  if (!user) {
    throw new Error('User object is required for transformation');
  }

  return {
    id: user._id?.toString() || '',
    name: user.name || 'Unknown User',
    email: user.email || '',
  };
};
