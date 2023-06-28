import { getVersionGradle } from "./lib/gradle.mjs";
import { getNpmVersion } from "./lib/npm.mjs";
import { getNamespace } from "./lib/oci.mjs";
import { exitWithError } from "./lib/utils.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

const { _ } = argv;
const [key] = _;

const regionKey = key;
console.log(`regionKey: ${regionKey}`);
const resourcePrincipalRegion = (
  await $`echo $OCI_RESOURCE_PRINCIPAL_REGION`
).stdout.trim();
console.log(`OCI_RESOURCE_PRINCIPAL_REGION: ${resourcePrincipalRegion}`);
console.log({ key });
const namespace = await getNamespace();

await createKustomizationYaml(regionKey, namespace);

async function createKustomizationYaml(regionKey, namespace) {
  const pwdOutput = (await $`pwd`).stdout.trim();
  console.log(pwdOutput);
  await cd(`${pwdOutput}/src/hello-server`);
  const helloVersion = await getNpmVersion();
  await cd(`${pwdOutput}/src/auth-server`);
  const authVersion = await getNpmVersion();
  await cd(`${pwdOutput}/src/japp-server`);
  const jappVersion = await getVersionGradle();
  await cd(pwdOutput);

  await cd("./k8s/overlay/prod");
  try {
    let { exitCode, stderr } =
      await $`sed 's/REGION_KEY/${regionKey}/' kustomization.yaml_template \
           | sed 's/AUTH_VERSION/${authVersion}/' \
           | sed 's/HELLO_VERSION/${helloVersion}/' \
           | sed 's/JAPP_VERSION/${jappVersion}/' \
           | sed 's/NAMESPACE/${namespace}/' > kustomization.yaml`;
    if (exitCode !== 0) {
      exitWithError(`Error creating kustomization.yaml: ${stderr}`);
    }
    console.log(`Overlay ${chalk.green("kustomization.yaml")} created.`);
  } catch (error) {
    exitWithError(error.stderr);
  } finally {
    await cd(pwdOutput);
  }
}
