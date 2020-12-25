const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    projectIsNow: state => state.app.projectIsNow,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    customer: state => state.user.customer,
    roles: state => state.user.roles,
    visitedViews: state => state.tagsView.visitedViews,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters
}
export default getters
