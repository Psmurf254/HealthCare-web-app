import { Stack, Typography } from "@mui/material";
import { companyLogos } from "../utils/constants";

const CompanyLogos = () => {
  return (
    <section
      style={{ overflowX: "hidden", textAlign: "center" }}
      className="companylogos"
    >
      <Typography variant="h6" color="text.secondary">
        All the Healthcare Services at Your Hand
      </Typography>
      <Stack
        direction="row"
        mt={6}
        justifyContent="space-between"
        border={1}
        borderRadius="20px"
      >
        {companyLogos.map((logo, index) => (
          <li key={index}>
            <img src={logo} width={85} height={85} alt={logo} />
          </li>
        ))}
      </Stack>
    </section>
  );
};

export default CompanyLogos;
