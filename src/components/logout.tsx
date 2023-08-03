export function logoutFunction() {
  fetch('/api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      window.location.href = '/'
    } else {
      alert('Misslyckades med utloggning.')
    }
  }).catch((err) => {
    alert('Misslyckades med utloggning.')
  })
}

export default function LogoutButton() {
  return (
    <button onClick={logoutFunction}>Logga ut</button>
  )
}