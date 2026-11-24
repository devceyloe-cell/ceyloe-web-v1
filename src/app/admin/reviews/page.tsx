import { ReviewsDashboard } from "@/components/admin/reviews-dashboard";
import { isMongoConfigured } from "@/config/env";

export const dynamic = "force-dynamic";

export default function AdminReviewsPage() {
  return <ReviewsDashboard mongoConfigured={isMongoConfigured()} />;
}
