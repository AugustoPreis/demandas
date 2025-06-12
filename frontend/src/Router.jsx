import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';

//Telas
const Login = lazy(() => import('./pages/login/Login'));
const Demandas = lazy(() => import('./pages/demandas/Demandas'));
const VisualizarDemanda = lazy(() => import('./pages/demandas/Visualizar'));
const EnviarDemanda = lazy(() => import('./pages/demandas/Enviar'));
const CadastrarDemanda = lazy(() => import('./pages/demandas/Cadastrar'));
const Usuarios = lazy(() => import('./pages/usuarios/Usuarios'));
const CadastrarUsuario = lazy(() => import('./pages/usuarios/Cadastrar'));

export default function Router() {
  const router = createBrowserRouter([
    {
      index: true,
      element: <Login />,
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      element: <PrivateRoute />,
      children: [
        {
          index: true,
          element: <Demandas />,
        },
        {
          path: '/demandas',
          element: <Demandas />,
        },
        {
          path: '/demandas/cadastrar',
          element: <CadastrarDemanda />,
        },
        {
          path: '/demandas/:id/visualizar',
          element: <VisualizarDemanda />,
        },
        {
          path: '/demandas/:id/enviar',
          element: <EnviarDemanda />,
        },
        {
          element: <AdminRoute />,
          children: [
            {
              path: '/usuarios',
              element: <Usuarios />,
            },
            {
              path: '/usuarios/:acao',
              element: <CadastrarUsuario />,
            },
            {
              path: '/usuarios/:id/:acao',
              element: <CadastrarUsuario />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}