export const routes = [
  {
    name: 'inbox',
    path: 'inbox',
    redirect: () => (
      {
        name: 'dashboard',
        query: {
          feed: 'myPendingTasks',
        },
      }
    ),
  },
  {
    name: 'inbox-item',
    path: 'inbox/:id',
    redirect: to => (
      {
        name: 'general',
        query: {
          exe: to.params.id,
        },
      }
    ),
  },
  {
    name: 'inbox-item-pid',
    path: 'inbox/:id/:pid',
    redirect: to => (
      {
        name: 'general',
        query: {
          exe: to.params.id,
          ptr: to.params.pid,
        },
      }
    ),
  },
];

export const inboxRoutes = {
  routes,
};

export default inboxRoutes;
