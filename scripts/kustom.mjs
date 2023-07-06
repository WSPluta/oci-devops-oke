import { getVersionGradle } from "./lib/gradle.mjs";
import { getNpmVersion } from "./lib/npm.mjs";
import { getNamespace } from "./lib/oci.mjs";
import { exitWithError } from "./lib/utils.mjs";

const shell = process.env.SHELL | "/bin/zsh";
$.shell = shell;
$.verbose = false;

const { _ } = argv;
const [key, webAuthToken] = _;

const regionKey = key;
const namespace = await getNamespace();

await createKustomizationYaml(regionKey, namespace);
await createAuthServerConfigFile(webAuthToken);

async function createKustomizationYaml(regionKey, namespace) {
  const pwdOutput = (await $`pwd`).stdout.trim();
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

async function createAuthServerConfigFile(webAuthToken) {
  const pwdOutput = (await $`pwd`).stdout.trim();
  await cd("./k8s/auth-server/");
  const webAuthTokenEscaped = webAuthToken.replaceAll("/", "\\/");
  const replaceCmdURL = `s/WEB_AUTH_TOKEN/${webAuthTokenEscaped}/`;
  try {
    let { exitCode, stderr } = await $`sed '${replaceCmdURL}' \
          .env-auth-server.template > .env-auth-server`;
    if (exitCode !== 0) {
      exitWithError(`Error creating .env-auth-server: ${stderr}`);
    }
    console.log(`Overlay ${chalk.green(".env-auth-server")} created.`);
  } catch (error) {
    exitWithError(error.stderr);
  } finally {
    await cd(pwdOutput);
  }
}
