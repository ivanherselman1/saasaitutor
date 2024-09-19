import { getProviders, signIn } from 'next-auth/react';

export default function SignIn({ providers }) {
  console.log("Providers:", providers); // Log the providers to check if they exist

  if (!providers) {
    return <div>No authentication providers available</div>;
  }

  return (
    <div>
      <h1>Sign In</h1>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  console.log("Fetched Providers:", providers); // Log to check the API call result
  return {
    props: { providers },
  };
}
