function AuthLayout({ sideImageSrc, children }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {sideImageSrc && (
        <div
          style={{
            flex: 1.85,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '0',
          }}
        >
          <img
            src={sideImageSrc}
            alt="Instagram"
            style={{
              width: '70%',
              height: 'auto',
              objectFit: 'contain',
              paddingRight: '0',
              marginRight: '0',
            }}
          />
        </div>
      )}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
