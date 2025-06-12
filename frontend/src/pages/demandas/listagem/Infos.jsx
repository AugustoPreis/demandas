import { Grid } from '@mui/material';
import LabeledText from '../../../components/TextLabel';
import { formatDate } from '../../../utils/date';

export default function Infos({ demanda }) {

  return (
    <Grid container
      mt={{ lg: 0, xs: 1 }}
      spacing={6}>
      <Grid>
        <LabeledText label='Horas Trabalhadas'>
          {demanda.horasTrabalhadas}
        </LabeledText>
      </Grid>
      <Grid>
        <LabeledText label='Previsão'>
          {demanda.dataPrevisao ? formatDate(demanda.dataPrevisao) : 'Não informada'}
        </LabeledText>
      </Grid>
    </Grid>
  );
}