import { motion } from 'framer-motion';

/** Welcome banner used at the top of the creator dashboard. */
export default function DashboardHeader({ title, description, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 text-white sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-indigo-100">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </motion.div>
  );
}
