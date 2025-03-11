import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import Main from '@/views/Main.vue'
import Join from '@/views/Join.vue'
import Welcome from '@/views/Welcome.vue'
import Profile from '@/views/Profile.vue'
import Side from '@/views/Side.vue'
import Posts from '@/views/Posts.vue'
import Search2 from '@/views/Search2.vue'
import PrivateChat from '@/views/PrivateChat.vue'

function isAuthenticated() {
	return !!localStorage.getItem('token');
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
			path: '/',
			name: 'home',
			component: Home,
			meta: { authRequired: false }
		},
		{
			path: '/signin',
			name: 'signin',
			component: SignIn,
			meta: { authRequired: false }
		},
		{
			path: '/main',
			component: Main,
			meta: { authRequired: true },
			children: [
				{
					path: '',
					name: 'main',
					components: {
						leftSidebar: Welcome,
						focus: Posts,
						rightSidebar: Search2
					},
					meta: { authRequired: true }
				},
				{
					path: '/profile',
					components: {
						leftSidebar: Side,
						focus: Profile,
						rightSidebar: Side
					},
					meta: { authRequired: true }
				},
				{
					path: '/user/:userId',
					components: {
						leftSidebar: Side,
						focus: PrivateChat,
						rightSidebar: Side
					},
					props: true,
					meta: { authRequired: true }
				}
			]
		},
		{
			path: '/join',
			name: 'join',
			component: Join,
			meta: { authRequired: false }
		},
		{
			path: '/:pathMatch(.*)*',
			redirect: '/'
		}
  ],
})

router.beforeEach((to, from, next) => {
	if (to.meta.authRequired && !isAuthenticated()) {
	  next('/');
	} else {
	  next();
	}
  });

export default router
