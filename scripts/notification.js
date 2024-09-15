const checkPerission = () => {
  if(!('serviceWorker' in navigator)) {
    throw new Error('No support for service worker!')
  }

  if(!('Notification' in window)) {
    throw new Error('No support for notification API')
  }
}
const requestNotificationPermission = () => {
  const permission = Notification.requestPermission()

  if(permission == 'granted') {
    console.log('Notification permission is granted')
  } else {
    console.log('Notification permission is not granted')
  }
}

const permissions = () => {
  checkPerission()
  requestNotificationPermission()
}

export const notify = async (notification, time, ids) => {
  // permissions()
  if(time.getTime()+200 >= Date.now()) {
    fetch('http://localhost:3001/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notification: notification, time: time, ids: ids ? ids : null, })
    })
  } else {
    console.log('Notification time is old')
  }
}

export const refreshNotifications = async(taskId, notifications) => {
  fetch('http://localhost:3001/refresh-notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId: taskId, notifications: notifications })
  })
}

export const sendToken = async () => {
  const { $token } = useNuxtApp()

  fetch('http://localhost:3001/send-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: $token })
  })
}