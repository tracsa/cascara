import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  es: {
    header: {
      title: 'Flujos de autorización',
      trackings: 'Seguimiento',
      documents: 'Documentos',
      processes: 'Procesos',
      tasks: 'Tareas',
      signout: 'Salir',
    },
    info: {
      aboutTasks: 'Aquí aparecerán tus tareas asignadas',
      aboutTasksMore: 'Actualmente no tienes ninguna tarea asignada.',
      aboutTrackings: 'Aquí aparecerán los procesos en los que estés involucrado',
      aboutTrackingsMore: 'Actualmente no estás involucrado en alguno.',
    },
    request: {
      authorization: 'Ssadf',
    },
    signin: {
      title: 'Ingresar',
      description: 'Inicia sesión para comenzar',
      username_placeholder: 'Usuario',
      password_placeholder: 'Contraseña',
      button: 'Ingresar',
      error_signin: 'El usuario o contraseña son incorrectos.',
      advanced_options: 'Opciones avanzadas',
    },
    processes: {
      start_process: 'Iniciar proceso',
      process: 'Proceso',
      processes: 'Procesos',
    },
    trackings: {
      trackings: 'Seguimiento',
    },
    timeline: {
      by: 'Por:',
      reason: 'Motivo:',
      date: 'Fecha:',
      asignTasks: 'Esta tarea también puede ser realizada por',
    },
    tasks: {
      my_tasks: 'Mis tareas',
    },
    doquer: {
      new_file: 'Nuevo documento',
    },
    commons: {
      required: 'Requerido',
      send: 'Enviar',
      cancel: 'Cancelar',
      loading: 'Cargando...',
      sending: 'Enviando...',
      upload: 'Subir',
      uploading: 'Subiendo...',
      name: 'Nombre',
      approve: 'Aprobar',
      reject: 'Rechazar',
    },
    validation: {
      required: 'Este campo es requerido',
      invalid_date: 'Fecha inválida',
      required_list: 'Este campo es requerido',
      uploading_document: 'Ocurrió un error al cargar el archivo.',
      invalid_file: 'El archivo es inválido.',
    },
    errors: {
      request: {
        authorization: 'Lo sentimos, tus credenciales son inválidas.',
      },
    },
  },
  en: {
    header: {
      title: 'Authorization flows',
      trackings: 'Tracking',
      documents: 'Documents',
      processes: 'Processes',
      tasks: 'Tasks',
      logout: 'SignOut',
    },
    info: {
      aboutTasks: 'Your assigned tasks will be appear here.',
      aboutTasksMore: 'You do not have assigned tasks yet.',
      aboutTrackings: 'Aquí aparecerán tus tareas asignadas',
      aboutTrackingsMore: 'Actualmente no tienes ninguna tarea asignada.',
    },
    signin: {
      title: 'SignIn',
      description: 'Sign in to start your session',
      username_placeholder: 'Username',
      password_placeholder: 'Password',
      button: 'Sign In',
      error_signin: 'We are sorry but it seems the username or password is wrong.',
    },
    processes: {
      start_process: 'Start process',
      process: 'Process',
      processes: 'Processes',
    },
    trackings: {
      trackings: 'Seguimiento',
    },
    timeline: {
      by: 'By:',
      reason: 'Motivo:',
      date: 'Fecha:',
    },
    tasks: {
      my_tasks: 'My tasks',
    },
    doquer: {
      new_file: 'Nuevo documento',
    },
    commons: {
      required: 'Required',
      send: 'Send',
      cancel: 'Cancel',
      loading: 'Loading...',
      sending: 'Sending...',
      upload: 'Upload',
      uploading: 'Uploading...',
      name: 'Nombre',
      approve: 'Approve',
      reject: 'Reject',
    },
  },
};

const i18n = new VueI18n({
  locale: 'es', // set locale
  messages, // set locale messages
});

export default i18n;
