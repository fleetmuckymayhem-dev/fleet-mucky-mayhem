"""Prepare a local, unconnected rehearsal tree; never push or apply rules."""
import argparse
import io
from pathlib import Path
import shutil
import subprocess
import tarfile

SOURCE = "1bad312fe06e266ab6b2e2ef5335f717edbc4d79"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("destination", type=Path, help="New directory, which must not exist")
args = parser.parse_args()
archive = subprocess.check_output(["git", "archive", SOURCE])
args.destination.mkdir(parents=True, exist_ok=False)
with tarfile.open(fileobj=io.BytesIO(archive)) as source:
    source.extractall(args.destination, filter="data")
workflow_dir = args.destination / ".github/workflows"
workflow = (workflow_dir / "check.yml").read_text()
workflow = workflow.replace(
    "branches: [main, staging]",
    "branches: ['rehearsal/2026-11-05/staging', 'rehearsal/2026-11-05/main']",
).replace("  workflow_dispatch:\n", "")
workflow = workflow.replace(
    "      - run: npm ci",
    "      - name: Rehearsal failure switch\n"
    "        run: test ! -e FIXTURE_EXPECT_FAILURE\n"
    "      - run: npm ci",
)
shutil.rmtree(workflow_dir)
workflow_dir.mkdir()
(workflow_dir / "check.yml").write_text(workflow)
for publisher in (args.destination / "scripts").glob("publish*"):
    publisher.unlink()
assert "secrets." not in workflow
assert "persist-credentials: false" in workflow
assert "contents: read" in workflow
assert "workflow_dispatch" not in workflow
assert "branches: [main, staging]" not in workflow
assert len(list(workflow_dir.iterdir())) == 1
assert not (args.destination / ".git").exists()
print(f"Prepared {args.destination} from {SOURCE}; no Git metadata, remote, or publisher workflow")
