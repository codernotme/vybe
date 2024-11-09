export default function Footer() {
  return (
    <>
      <footer className="h-16">
        <div className="flex h-full gap-4 justify-center items-center flex-col">
          <div className="flex gap-4">
            <p className="text-sm font-medium text-slate-500">
              Terms of Service
            </p>
            <p className="text-sm font-medium text-slate-500">Privacy Policy</p>
            <p className="text-sm font-medium text-slate-500">Cookie Policy</p>
          </div>
          <div className="flex gap-4">
            <p className="text-sm font-medium text-slate-500">Ads Info</p>
            <p className="text-sm font-medium text-slate-500">© 2023 Echo</p>
          </div>
        </div>
      </footer>
    </>
  );
}
