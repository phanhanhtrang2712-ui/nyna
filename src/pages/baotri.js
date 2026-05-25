export default function MaintenancePage() {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f3f4f6', color: '#1f2937',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', padding: '20px', boxSizing: 'border-box'
    }}>
      <div style={{
        textAlign: 'center', background: 'white', padding: '40px 30px',
        borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        maxWidth: '500px', width: '100%'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚧</div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
          Website hiện đang tạm dừng hoạt động
        </h1>
        <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6' }}>
          Chúng tôi đang tiến hành nâng cấp hệ thống. Xin lỗi vì sự bất tiện này!
        </p>
      </div>
    </div>
  );
}
