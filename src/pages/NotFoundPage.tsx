import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold sm:text-3xl">Page not found</h1>
      <p className="mt-2 text-gray-600">This page does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Back to home
      </Link>
    </main>
  )
}
